const { S3 } = require("aws-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = uploadVidToS3 = async (vid) => {
  const s3 = new S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: "ap-northeast-2",
  });

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
};
