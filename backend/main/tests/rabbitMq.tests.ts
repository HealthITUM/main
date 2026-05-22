// test route:
// app.get("/test", async (req: Request, res : Response) => {
//   if (queueService.isInit()){
//     await queueService.publish("pdet.task.important", "test_message");
//     console.log("[TEST] Message sent!");
//     return res.status(200).json({ message : "Success!"});
//   }
//   return res.status(400).json({ message : "[TEST] Not initialized!"});
// });