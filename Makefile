all: 

deploy:
	yarn build
	PYTHONPATH="" aws s3 cp build  s3://www.msergio.com/dexvis/ --acl public-read 
