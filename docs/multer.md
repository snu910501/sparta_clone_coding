# S3, Multer, Lambda, MediaConverter

## 개요

Multer와 S3를 활용해 사용자가 동영상을 업로드하고 S3에 업로드된 영상을 자동으로 Lambda와 MediaConverter을 통해 영상 화질별(360p, 540p, 720p) 저장과 썸네일용 이미지 파일 추출을 할 수 있다.

## 처리 과정

프론트와의 1차적인 통신은 EC2 서버를 통해 진행되기 때문에 EC2 서버에 업로드할 영상을 임시 저장 후 S3에 업로드 해야한다.

1. router.post의 미들웨어를 통해 uploads 폴더에 영상을 임시 저장

```
// routes/post.routes.js 코드 중 일부
...
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads"); // 서버 루트 폴더의 uploads 폴더에 임시 저장
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

router.get("/", postController.findAllPost);
router.post(
  "/",
  authMiddleware,
  upload.single("video"), // 업로드할 파일은 하나, 타입은 "video"
  postController.createPost
);
...
```

2. Controller에서 req.file로 받은 후 Service로 전달

```
// controllers/post.controller.js 코드 중 일부
...
  createPost = async (req, res) => {
    try {
      const userId = res.locals.user.dataValues.userId;
      const { title, content, tag } = req.body;
      const vid = req.file;

      await this.postService.createPost(title, content, tag, vid, userId);
...
```

3. Service에서 받은 파일을 uploadVidToS3로 전달해 S3에 업로드

```
// middlewares/uploadVidToS3 코드 중 일부
// 파일 이름 정규표현식으로 변환
  // 파일이름에 띄어쓰기, 특수문자등이 있으면 읽기 에러가 생겨 제거
  const filename = vid.originalname
    .replace(/[^\w.]/g, "") // 숫자,알파벳,"." 제외 전부 제거
    .replace(/[.]{2,}/g, "."); // "." 연속 두개 이상 하나로 교체
  let arr = filename.split(".");
  const extention = arr.pop();
  let name = arr.join(".").substring(0, 10);
  name = name.padEnd(3, "a"); // 파일 이름 없으면 길이 3까지 "a"추가
  vid.originalname = `${name}.${extention}`;

  const fileStream = fs.createReadStream(vid.path);
  const result = await s3
    .upload({
      Bucket: "clone-coding-syk",
      contentType: "video/mp4",
      ContentDisposition: "inline", // FE 재생 해주는 태그
      // S3 - originals 폴더에 저장
      Key: `originals/${Date.now()}_${vid.originalname}`,
      Body: fileStream,
    })
    .promise();

  // S3 업로드 후 uploads 폴더 내 파일 삭제
  fs.readdir("uploads/", (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join("uploads/", file), (err) => {
        if (err) throw err;
      });
    }
  });

  // 람다 변환된 링크로 문자열 변환
  const key = result.Key.replace("originals/", "").replace(`.${extention}`, "");
  const url = result.Location.split("originals/")[0];
  const compVid = `${url}converted/${key}/Default/HLS/${key}_360.m3u8`;
  const origVid = `${url}converted/${key}/Default/HLS/${key}.m3u8`;
  const thumbnail = `${url}converted/${key}/Default/Thumbnails/${key}.0000003.jpg`;

  return { compVid, origVid, thumbnail };
```

파일 이름에 띄어쓰기나 특수문자가 있으면 S3에 들어온 파일을 자동 감지할 때 실제로 S3에 저장된 파일 이름과 람다에서 찾으려고 하는 파일 이름이 달라 정규표현식을 이용해 특수 문자 및 공백을 삭제해줬다.<br>
그리고 실제로 FE에서 활용할 영상은 람다와 MediaConverter가 변환한 영상이기 때문에 DB에 저장할 URL을 변환시켰다.

## S3, Lambda, MediaConverter 연동

1. IAM 역할 만들기

- IAM-역할-역할 생성-AWS 서비스에서 MediaConvert와 Lambda 역할을 생성
- Lambda 역할에 MediaConvert 역할에서 만들어진 arn을 넣어야함
  ```
  // 인라인 정책에 넣을 Json 내용
  {
  "Version": "2012-10-17",
  "Statement": [
      {
          "Action": [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents"
          ],
          "Resource": "*",
          "Effect": "Allow",
          "Sid": "Logging"
      },
      {
          "Action": ["iam:PassRole"],
          "Resource": ["이전에 생성한 MediaConvertRole의 ARN"],
          "Effect": "Allow",
          "Sid": "PassRole"
      },
      {
          "Action": ["mediaconvert:*"],
          "Resource": ["*"],
          "Effect": "Allow",
          "Sid": "MediaConvertService"
      },
      {
          "Action": ["s3:*"],
          "Resource": ["*"],
          "Effect": "Allow",
          "Sid": "S3Service"
      }
  ]
  ```

2. S3 버킷 생성
3. Lambda 생성

- 동영상 및 썸네일 제작 코드 소스는 다른곳에서 받아왔다 [출처](https://github.com/aws-samples/aws-media-services-vod-automation)
- 런타임 설정은 (영상 처리 코드 파일 이름).handler로 입력 (eg. convert.handler)
- 변환시킨 파일 저장 경로는 구성-환경 변수의 DestinationBucket에 (버킷이름)/(폴더이름) 과 같이 지정

```
// 환경 변수 설정 값
Application = VOD
MediaConvertRole = [위에서 등록한 MediaConvertRole의 ARN]
DestinationBucket = [output 버킷이름]
```

- 트리거 생성에서 S3 지정 및 업로드
  - 접두사를 입력해 S3 버킷의 어느 폴더에 들어온 파일을 자동 감지할 지 지정할 수 있다
