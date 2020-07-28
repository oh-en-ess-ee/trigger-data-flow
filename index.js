const { google } = require("googleapis");
const dataflow = google.dataflow('v1b3')

exports.kickOffPipeline = async function (file, context, callback) {
  if (file.name) {
    const request = {
      location: "europe-west2",
      projectId: process.env.PROJECT_ID,
      requestBody: {
        jobName: "Parse jsonl file",
        parameters: {
          inputFile: `gs://${file.bucket}/${file.name}`
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
      let result = dataflow.projects.locations.templates.launch(request);
      callback()
      return result;
    }).catch(error => {
      console.log(error);
      throw error;
    });
  }
};