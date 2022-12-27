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

  const fileStream = fs.createReadStream(vid.path);
  const result = await s3
    .upload({
      Bucket: "clone-coding-syk",
      contentType: "video/mp4",
      ContentDisposition: "inline", // FE 재생 해주는 태그
      // S3 - originals 폴더에 저장
      Key: `originals/${Date.now()}${vid.originalname}`,
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

  const url = result.Location;
  const key = result.Key;
  return { url, key };
};
