sam update --template-file ./package.yml --stack-name uploader --image-repository 591864715973.dkr.ecr.us-west-2.amazonaws.com/uploader --capabilities CAPABILITY_IAM --parameter-overrides destBucket=iv-alex-oregon-bucket-war1