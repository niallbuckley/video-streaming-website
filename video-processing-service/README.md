To build image on m1:
gcloud builds submit --tag us-central1-docker.pkg.dev/streaming-website-c8fc7/video-processing-service/vid-processing-service-gc

--Probably not necessary--
push the docker image to Google artifact registry:
docker build -t us-central1-docker.pkg.dev/<PROJECT_ID>/video-processing-repo/video-processing-service-gc .
