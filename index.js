const google = require("googleapis");

exports.kickOffPipeline = function (file, context, callback) {
  if (file.name) {
    google.auth.getApplicationDefault(function (err, authClient, projectId) {
      if (err) {
        throw err;
      }
      if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        authClient = authClient.createScoped([
          'https://www.googleapis.com/auth/cloud-platform',
          'https://www.googleapis.com/auth/userinfo.email'
        ]);
      }
      const dataflow = google.dataflow({version: 'v1b3', auth: authClient});
      dataflow.projects.templates.create({
        projectId: projectId,
        resource: {
          parameters: {
            inputFile: `gs://${file.bucket}/${file.name}`,
            outputFile: `gs://${process.env.OUTPUT_BUCKET}/${file.name}-processed`
          },
          jobName: 'process-feed',
          gcsPath: `gs://${process.env.TEMPLATE_BUCKET}/dataflow/templates/local`
        }
      }, function (err, response) {
        if (err) {
          console.error("Unable to run dataflow template. Error: ", err);
        }
        console.log("Dataflow template response: ", response);
        callback();
      });
    });
  }
};