#! /bin/bash

pnpm test:unit
pnpm build
pnpm dlx wrangler pages deploy dist