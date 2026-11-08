# How it works

Deep mode: what the site's JavaScript is made of and what its start page did while we watched.

## Its JavaScript

Analysed 79 script(s) from https://word.cloud.microsoft/en-us/: 78 module(s), 333 endpoint(s), 21 route(s), bundled with webpack.

Evidence ev_9c99d7b5140f1c29df457459373216aca64399c3b1fe9eccb174da6522263308.

```json
{
  "api_operations": [],
  "app_kind": "unknown",
  "bundlers": [
    "webpack"
  ],
  "edges": [
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#32909"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#48419"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#57184"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#72803"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#80111"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#83734"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#n@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#o@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#44095",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#44095@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#44095",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#Y@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#44095",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#u@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#81322",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#33360"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#81322",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#59784"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#81322",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#65176"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#81322",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#93513"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#81322",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#99037"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#81322",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#81322@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#81322",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#u@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#15835"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#22254"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#24827"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#32909"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#32922"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#33972"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#34278"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#35568"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#38679"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#39552"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#40776"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#43097"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#44095"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#44472"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#47322"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#48419"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#57184"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#58208"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#59150"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#6080"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#62275"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#66990"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#68342"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#72803"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#78620"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#79218"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#80111"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#81322"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#83734"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90195"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#92463"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "requires",
      "to": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#92468"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#L@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#N@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#O@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#90859",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js#P@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#2869",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#2869@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#<anonymous@1>@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#CentroUrlDod@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#CentroUrlGcc@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#CentroUrlGccm@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#CentroUrlInt@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#CentroUrlProd@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#CentroUrlTenantCloudTypeMap@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#DefaultMajorVersion@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#ECS_LAST_TELEMETRY_EVENTS_HEADER@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#49054",
      "kind": "defines",
      "to": "fn:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js#ForceSendLog@1"
    },
    {
      "from": "bundle-module:res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf83
```

## Ten seconds of it

Watched https://word.cloud.microsoft/en-us/ for 10000ms: 0 request outline(s), 2 console entr(y/ies).

Evidence ev_600cb96809b89c89e6e9c49a4045efca57fff01e642df4dcd6ab0ef6a1410d51.

```json
{
  "accessibility": null,
  "console": {
    "count": 2,
    "entries": [
      {
        "level": "warning",
        "source": "security"
      },
      {
        "level": "warning",
        "source": "security"
      }
    ],
    "has_text": false
  },
  "dom": {
    "attribute_names": [
      "alt",
      "aria-busy",
      "aria-describedby",
      "aria-expanded",
      "aria-haspopup",
      "aria-hidden",
      "aria-label",
      "aria-posinset",
      "aria-selected",
      "aria-setsize",
      "as",
      "charset",
      "class",
      "content",
      "crossorigin",
      "cx",
      "cy",
      "d",
      "data-fui-icon",
      "data-make-styles-bucket",
      "data-merge-styles",
      "data-overflow-item",
      "data-priority",
      "data-sizes",
      "data-src",
      "data-srcset",
      "data-tabster",
      "data-tabster-dummy",
      "data-testid",
      "data-version",
      "dir",
      "fetchpriority",
      "fill",
      "gradienttransform",
      "gradientunits",
      "height",
      "href",
      "hreflang",
      "http-equiv",
      "id",
      "lang",
      "loading",
      "media",
      "name",
      "nonce",
      "offset",
      "placeholder",
      "property",
      "r",
      "rel",
      "role",
      "sizes",
      "src",
      "srcset",
      "stop-color",
      "stop-opacity",
      "style",
      "tabindex",
      "target",
      "type",
      "value",
      "viewbox",
      "width",
      "x1",
      "x2",
      "xmlns",
      "y1",
      "y2"
    ],
    "elements_by_name": {
      "a": 29,
      "base": 1,
      "body": 1,
      "button": 45,
      "defs": 1,
      "div": 190,
      "footer": 1,
      "h1": 1,
      "h2": 6,
      "head": 1,
      "html": 1,
      "i": 6,
      "img": 39,
      "input": 1,
      "li": 24,
      "lineargradient": 3,
      "link": 125,
      "meta": 14,
      "p": 4,
      "path": 15,
      "picture": 1,
      "radialgradient": 2,
      "script": 19,
      "source": 3,
      "span": 13,
      "stop": 13,
      "style": 83,
      "svg": 7,
      "title": 1,
      "ul": 2
    },
    "text_nodes": 110,
    "total_nodes": 764,
    "truncated": false
  },
  "dropped_events": 0,
  "frame_origins": [
    "https://word.cloud.microsoft"
  ],
  "network": {
    "request_count": 0,
    "requests": []
  },
  "origin": "https://word.cloud.microsoft/en-us/",
  "resources": [
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_38176_a34018fe89f0d52a.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_55097_bac6aa10e68c5e0e.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_21821_073ea6276accea3d.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_apphome_en-us_257c12b3166cf38d.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_95318_7b6fafd8b1c57471.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_9101_97cdf27f9dc81756.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_60597_82846c5492ee2c3b.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_5197_b0e97eb5677142ab.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_68972_97bdb6d73119f624.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_7608_68aec129901f27b6.bundle.js"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/39a7caa3-5fa6-435c-9d27-8374d0b22363/thumbnails/400/mergers-%2526-acquisitions-report-blue-modern-simple-0-1-a6f44f678850.webp"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_62180_98ff329c0c1bf636.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_17178_48e87531de7cc7f1.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_85109_09ac1e7f3833419e.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_17335_19ada3f2801df7da.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_9029_a5bb3002fc6faedf.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_85769_72fac45c8a2c8121.bundle.js"
    },
    {
      "mime_type": "image/svg+xml",
      "type": "Image",
      "url": "https://res.cdn.office.net/files/fabric-cdn-prod_20251117.001/assets/brand-icons/product/svg/word_16x1.svg"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_60529_eec949016dceed2b.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_63315_c05588fa7f46f2d8.bundle.js"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/2c627d15-1699-495f-8c10-9f567aa21751/thumbnails/400/skills-focus-graphic-professional-resume-orange-modern-bold-0-1-894678d242a8.webp"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/e809680f-ff89-46ad-aadf-daa1ded6b20a/thumbnails/400/modern-classic-professional-resume-%253Cnull%253E-modern-simple-0-1-e03ef4cb5763.webp"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/aa0261c5-ea5f-44f5-820e-f69b5820c21a/thumbnails/400/employee-recommendation-letter-blue-modern-simple-0-1-08f4a04d3ed5.webp"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_80835_13201aec50f0f0d1.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_71856_21ebaa34a7f2d832.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_43939_03b26d9bf66f2f64.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_77435_95b3d28630cb6d6d.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_reactdom_ddd528f85ada9ab3.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_94155_407dba63e532e0c4.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_96636_97e5357ea3735305.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_word_4ea4dba181260557.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_azurebrowser_ec45bd23af8744ce.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_1218_722dbf8375582183.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_3497_a0603522524d9b6e.bundle.js"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/e083b34d-94bc-4182-b6d5-1b74d75645d1/thumbnails/400/money-saving-tips-for-retirement-checklist-green-modern-simple-0-1-6b67489c11ea.webp"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_5286_dafffc2536a7a8bc.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_97877_8e3bd380f54c2042.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_79814_0673f8772053db34.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_azurecommon_1a9d53b93312413a.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_54625_2bf5b0c91e19cd0c.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_79003_4803677626a1cfa6.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_88512_583cfc331043943d.bundle.js"
    },
    {
      "mime_type": "image/gif",
      "type": "Image",
      "url": "data:image/gif;base64,R0lGODlhAQABAPAAAPj4+P///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_10561_606838862b729918.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_34168_9b66f52072aa5c4e.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_24411_1db1cfc3ca982128.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_75538_0af895d0efda5ab3.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_8361_5f0ade1d04cfc757.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_31309_32c214e7db0e71b1.bundle.js"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff2"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_90521_738549581ac8d5a0.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_8352_c4676f4da7f77c61.bundle.js"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/78fbf859-85f4-4560-96e6-2ac1bac69b89/thumbnails/400/modern-accounting-resume-white-modern-simple-0-1-824cf37e0cab.webp"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_78476_7ab3008d71eaa44b.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_63882_c145f96779f12ebd.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_37925_128a1f3fa8c1f79f.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_91831_1f55c2af11bb99b6.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_74543_23eb39701585a8c9.bundle.js"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/ed7e3ebf-e287-46a8-a21a-188cb70ce224/thumbnails/400/classic-ui%252Fux-designer-resume-modern-simple-0-1-88ea13166a85.webp"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/e9a368db-067e-446a-a618-e40d248b2b03/thumbnails/400/services-invoice-with-hours-and-rate-green-modern-simple-0-1-3834dcb2684d.webp"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_48320_ca50b7847d863c7e.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_66292_7c8459b8a68cbc94.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_54350_433fc34096817297.bundle.js"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/uploadedfiles/uploads/f3e96c26-c817-47d2-a053-831c8407a7c3-simple-saas-business-proposal-green-modern-simple-0-1.webp"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_97641_8448ce0a6716667a.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_router_f659bd21d003c42b.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_47955_1c6660955668dcba.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_82647_abe3b4b963b70c9d.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_45999_3df749369533e72a.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_90718_9b512e001d532779.bundle.js"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_60975_8c2affda66bb6e98.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_react_c2f5c7d19a1c0c6f.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_30946_220fa9d08b6def84.bundle.js"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/uploadedfiles/uploads/0fd11e9c-509a-443d-8a20-ae44a010fd57-live-music-concert-event-brochure-blue-modern-bold-0-1.webp"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/1776bb69-cfc5-4cb1-90e4-db776e130050/thumbnails/400/mla-style-paper-9th-edition-modern-simple-0-1-a63aecb27977.webp"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_99149_f1bff3575a9d32ec.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_44362_7f8a8d372b3c6577.bundle.js"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://createcatalog.public.onecdn.static.microsoft/catalog-assets/en-us/368c07a1-6af6-44f1-8c94-82280cb6067d/thumbnails/400/bold-border-professional-cover-letter-modern-simple-0-1-0991253dbbbe.webp"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_5454_b8989a0f6fa00fb0.bundle.js"
    },
    {
      "mime_type": "image/webp",
      "type": "Image",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_651f0421917fdf2c0df9433167fdb4f0.webp"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_47804_dc8d2d779704159c.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_18773_3d293c54f141ffea.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_74824_825a8676342778f8.bundle.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_9790
```
