const google = require("googleapis");

exports.kickOffPipeline = function(event, callback) {
  const file = event.data;
  if (file.resourceState === 'exists' && file.name) {
    google.auth.getApplicationDefault(function (err, authClient, projectId) {
      if (err) {
        throw err;
      }
      if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        authClient = authClientt.createScoped([
          'https://www.googleapis.com/auth/cloud-platform',
          'https://www.googleapis.com/auth/userinfo.email'
        ]);
      }
      const dataflow = google.dataflow({ version: 'v1b3', auth: authClient});
      dataflow.projects.templates.create({
        projectId: projectId,
        resource: {
          parameters: {
            inputFile: `gs://${file.bucket}/${file.name}`,
            outputFile: `gs://${process.env.OUTPUT_BUCKET}/${file.name}-processed`
          },
          jobName: 'process-feed',
          gcsPath: `gs://${process.env.TEMPLATE_BUCKET}/templates/ProcessFeed`
        }
      }, function(err, response) {
        if (err) {
          console.error("Unable to run dataflow template. Error: ", err);
        }
        console.log("Dataflow template response: ", response);
        callback();
      });
    });
  }
};