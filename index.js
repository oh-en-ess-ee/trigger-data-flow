const { google } = require("googleapis");
const dataflow = google.dataflow('v1b3')

exports.kickOffPipeline = function (file, context, callback) {
  if (file.name) {
    const request = {
      projectId: process.env.GCLOUD_PROJECT,
      requestBody: {
        jobName: "Parse jsonl file",
        parameters: {
          inputFile: `gs://${file.bucket}/${file.name}`,
          outputFile: `gs://${process.env.OUTPUT_BUCKET}/${file.name}-processed`
        },
        environment: {
          tempLocation: `gs://${process.env.TEMPLATE_BUCKET}/tmp`
        }
      },
      gcsPath: `gs://${process.env.TEMPLATE_BUCKET}/dataflow/templates/local`
    }

    google.auth.getClient({
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform'
      ]
    }).then(auth => {
      request.auth = auth;
      let result = dataflow.projects.templates.launch(request);
      callback()
      return result;
    }).catch(error => {
      console.log(error);
      throw error;
    });
  }
};