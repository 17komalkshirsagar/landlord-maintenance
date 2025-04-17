
// import fs from "fs";



// import multer from "multer";


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const uploadPath = "galaxy/";
//         if (!fs.existsSync(uploadPath)) {
//             fs.mkdirSync(uploadPath, { recursive: true });
//         }
//         cb(null, uploadPath);
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// export const upload = multer({ storage }).single("profile");



import fs from "fs";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "galaxy/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedDocTypes = ["application/pdf"];

    if (
        file.fieldname === "image" && allowedImageTypes.includes(file.mimetype) ||
        file.fieldname === "documents" && allowedDocTypes.includes(file.mimetype)
    ) {
        cb(null, true);
    } else {
        console.log("error from multer");

    }
};


export const upload = multer({
    storage,
    fileFilter
}).fields([
    { name: "image", maxCount: 1 },
    { name: "documents", maxCount: 5 }
]);


