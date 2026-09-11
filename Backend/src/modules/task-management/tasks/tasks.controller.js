import { taskService } from "./tasks.service.js";
const run = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res)).catch(next);
const uploadedFiles = (files = []) =>
  files.map((file) => ({
    fileName: file.originalname,
    fileUrl: `/public/task-attachments/${file.filename}`,
    mimeType: file.mimetype,
    fileSize: file.size,
  }));
export const taskController = {
  list: run(async (req, res) =>
    res.json(await taskService.list(req.query, req.user, req.permissionKeys)),
  ),
  get: run(async (req, res) =>
    res.json(await taskService.get(req.params.id, req.user, req.permissionKeys)),
  ),
  assignees: run(async (req, res) =>
    res.json(await taskService.assignees(req.user, req.permissionKeys)),
  ),
  create: run(async (req, res) =>
    res
      .status(201)
      .json(await taskService.create(req.user, req.permissionKeys, req.validatedBody)),
  ),
  update: run(async (req, res) =>
    res.json(
      await taskService.update(
        req.params.id,
        req.user,
        req.permissionKeys,
        req.validatedBody,
      ),
    ),
  ),
  remove: run(async (req, res) => {
    await taskService.remove(req.params.id);
    res.status(204).end();
  }),
  upload: run(async (req, res) => {
    taskService.authorizeAssignment(req.user, req.permissionKeys);
    res.status(201).json(uploadedFiles(req.files));
  }),
  attach: run(async (req, res) =>
    res.json(
      await taskService.addAttachments(
        req.params.id,
        uploadedFiles(req.files),
        req.user,
        req.permissionKeys,
      ),
    ),
  ),
  comment: run(async (req, res) =>
    res
      .status(201)
      .json(
        await taskService.addComment(
          req.params.id,
          req.user.id,
          req.validatedBody.body,
          req.user,
          req.permissionKeys,
        ),
      ),
  ),
  addTime: run(async (req, res) =>
    res
      .status(201)
      .json(
        await taskService.addTime(
          req.params.id,
          req.user.id,
          req.validatedBody,
          req.user,
          req.permissionKeys,
        ),
      ),
  ),
  monthlyReport: run(async (req, res) =>
    res.json(await taskService.monthlyReport(req.validatedBody.month)),
  ),
};
