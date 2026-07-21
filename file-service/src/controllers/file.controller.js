const fileService = require("../services/file.service");

const DownloadFile = async (req, res, next) => {
    try {
        const { stream, metadata } =
            await fileService.DownloadFile(req.params.id);

        res.setHeader("Content-Type", metadata.mimeType);

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${encodeURIComponent(metadata.originalName)}"`
        );

        stream.pipe(res);

    } catch (err) {
        next(err);
    }
};
/*
Download từ frontend

const response = await axios.get(
    `/files/${id}/download`,
    {
        responseType: "blob",
    }
);

const url = window.URL.createObjectURL(response.data);

const a = document.createElement("a");
a.href = url;
a.download = "report.pdf";
a.click();

window.URL.revokeObjectURL(url);

*/

const UploadFile = async (req, res, next) => {
    try {
        const result = await fileService.UploadFile(req.file, req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: "Upload file successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const GetFile = async (req, res, next) => {
    try {
        const result = await fileService.GetFile(req.params.id);

        return res.status(200).json({
            success: true,
            message: "File's infomation retrieved successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const UpdateFile = async (req, res, next) => {
    try {
        const result = await fileService.UpdateFile(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "File's infomation updated successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const DeleteFile = async (req, res, next) => {
    try {
        const result = await fileService.DeleteFile(req.params.id);

        return res.status(204).json({
            success: true,
            message: "File deleted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    DownloadFile,
    UploadFile,
    GetFile,
    UpdateFile,
    DeleteFile,
}