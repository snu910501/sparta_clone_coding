const { S3 } = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

module.exports = uploadVidToS3 = async (image) => {
  const s3 = new S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: "ap-northeast-2",
  });

  const promiseVid = (image) => {
    const fileStream = fs.createReadStream(image.path);

    return s3
      .upload({
        Bucket: "clone-coding-syk",
        // 파일명
        Key: `thumbnails/${Date.now()}${file.originalname}`,
        Body: fileStream,
      })
      .promise();
  };

  //   fs.rmdir("uploads/", { recursive: true }, (err) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   });

  const result = await Promise.all(promiseVid);
  console.log("url", result);
  const url = { location: result.Location, fileName: result.key };

  return url;
};
