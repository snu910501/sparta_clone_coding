const { S3 } = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();
const path = require("path");

module.exports = uploadVidToS3 = async (image) => {
  let url = [];
  const s3 = new S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: "ap-northeast-2",
  });

  const promiseList = image.map((file) => {
    // 이미지 파일 이름 변환 (특수문자, 공백등 S3에서 에러남)
    const filename = file.originalname
      .replace(/[^\w.]/g, "") // 숫자,알파벳,"." 제외 전부 제거
      .replace(/[.]{2,}/g, "."); // "." 연속 두개 이상 하나로 교체
    let arr = filename.split(".");
    const extention = arr.pop();
    let name = arr.join(".").substring(0, 10);
    name = name.padEnd(3, "a"); // 파일 이름 없으면 길이 3까지 "a"추가
    file.originalname = `${name}.${extention}`;
    // 파일 이름 변환 끝

    const fileStream = fs.createReadStream(file.path);
    // buffer, stream

    return s3
      .upload({
        Bucket: "clone-coding-syk",
        // 파일명
        Key: `profiles/${Date.now()}_${file.originalname}`,
        Body: fileStream,
      })
      .promise();
  });

  const result = await Promise.all(promiseList);

  console.log("url", result);
  result.map((v) => {
    url.push({ location: v.Location, fileName: v.key });
  });

  // S3 업로드 후 uploads 폴더 내 파일 삭제
  fs.readdir("uploads/", (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join("uploads/", file), (err) => {
        if (err) throw err;
      });
    }
  });
  console.log("rulzz", url[0].location);
  return url;
};
