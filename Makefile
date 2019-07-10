# OSX uses the group id `20` for the user & alpine has already a group
# with that id causing compatibility issues
# This conditional checks if group id `20` is used and uses `1111` instead.
GROUP_ID?=$$(if [ $$(id -g) = '20' ]; then echo 1111; else id -g; fi)
USER_ID?=$$(id -u)

IMAGE_BASE_NAME=txinsights
IMAGE_TARGET_STAGE=devel
IMAGE_TARGET_TAG=devel

build:
	make _build

production_image:
	make build \
		IMAGE_TARGET_STAGE=production \
		IMAGE_TARGET_TAG=latest

_build:
	DOCKER_BUILDKIT=1 docker \
		build \
		--progress=plain \
		--build-arg USER_ID=${USER_ID} \
		--build-arg GROUP_ID=${GROUP_ID} \
		--target ${IMAGE_TARGET_STAGE} \
		-t ${IMAGE_BASE_NAME}:${IMAGE_TARGET_TAG} \
		-f docker/Dockerfile .

up:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		up txinsights-worker

stop:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		-f docker-compose.ci.yml \
		stop

delete:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		-f docker-compose.ci.yml \
		down

citest: _precommit _test_suite

_test_suite:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.ci.yml \
		run --rm --entrypoint=sh txinsights-worker \
		-c "npm run coverage"

_precommit:
	docker-compose \
		-f docker-compose.ci.yml \
		-f docker-compose.yml \
		run --rm pre-commit

shell:
	docker-compose \
		run \
		--entrypoint=sh \
		--rm \
		txinsights-worker

generate-package-lock:
	docker run -it -v "$(PWD):/usr/app" txinsights:devel install
