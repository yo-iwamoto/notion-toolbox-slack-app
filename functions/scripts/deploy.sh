#! /bin/bash
gcloud functions deploy handleSlack \
	--runtime=nodejs16 \
	--trigger-http \
	--region=asia-northeast1
