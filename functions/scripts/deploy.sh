#! /bin/bash
gcloud functions deploy handleSlack --runtime=nodejs16 --trigger-http --project=slack-notion-toolbox
