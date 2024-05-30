const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Configuration de l'accès à S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Fonction pour envoyer un fichier vers S3
const uploadToS3 = async (file, folderName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folderName}/${uuidv4()}_${Date.now()}.${file.originalname
      .split(".")
      .pop()}`, // Utilisation d'un nom de fichier unique avec l'extension
    Body: file.buffer, // Contenu du fichier
    ContentType: file.mimetype || "application/octet-stream", // Définir le type de contenu
  };

  const data = await s3.upload(params).promise();
  return data.Location; // Renvoie l'URL du fichier uploadé sur S3
};

module.exports = { s3, uploadToS3 };
