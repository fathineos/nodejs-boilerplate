build:
	docker-compose build gs-web

up:
	docker-compose up gs-web

test: _precommit _test_suite

_test_suite:
	docker-compose run --rm gs-web npm test

_precommit:
	docker-compose run --rm pre-commit
