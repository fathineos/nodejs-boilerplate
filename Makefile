build:
	docker-compose build gs-web

up:
	docker-compose up gs-web

test: _precommit

_precommit:
	docker-compose run --rm pre-commit
