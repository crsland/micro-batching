################################################################
## Deployment Configuration
################################################################

PATH:=node_modules/.bin:$(PATH)
SHELL:=/bin/bash

# Extract keys from package.json
# Usage: PKG_VERSION:=$(call GetFromPkgJson,version)
define GetFromPkgJson
$(shell cat package.json \
  | grep $(1) \
  | head -1 \
  | awk -F: '{ print $$2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]' \
)
endef

PKG_NAME:=$(call GetFromPkgJson,name)
PKG_VERSION:=$(call GetFromPkgJson,version)

APP_PORT=80
APP_NAME=$(PKG_NAME)
APP_API_VERSION:=$(shell cut -d '.' -f 1 <<< "$(PKG_VERSION)").$(shell cut -d '.' -f 2 <<< "$(PKG_VERSION)")
APP_API_PREFIX:=api/v$(APP_API_VERSION)

COMPOSE=docker-compose -p dev

################################################################
## Docker
################################################################

docker-up:
	$(COMPOSE) up -d $(APP_NAME)
	@echo "✅  Container is running."
	@echo "🏃  Project running in background in isolated container. Docs available from https://$(LOCAL_APP_HOSTNAME)/$(APP_API_PREFIX)/docs/#"
.PHONY: docker-up

docker-down:
	$(COMPOSE) down
	@echo "🛑  Container was stopped successfully."
.PHONY: docker-down

docker-build: docker-login
	$(COMPOSE) build
.PHONY: docker-build


################################################################
## Building & Testing
################################################################

build:
	$(COMPOSE) build
.PHONY: build

test:
	@echo "+++ :jest: Running tests..."
	$(COMPOSE) run --rm --entrypoint=sh $(APP_NAME) -c 'yarn run test'
.PHONY: test

################################################################
## Running the application
################################################################

start:
	$(COMPOSE) run --rm --entrypoint=sh $(APP_NAME) -c 'yarn run start:dev'
.PHONY: start
