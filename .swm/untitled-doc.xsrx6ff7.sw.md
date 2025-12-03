---
title: Untitled doc
---

\# API Endpoints

\## Posts teenus (port 3050)

\### GET /api/posts

Tagastab kõik postitused

\### POST /api/posts

Loob uue postituse

**Body:**

\`\`\`json

{

&nbsp;&nbsp;"title": "string",

&nbsp;&nbsp;"content": "string",

&nbsp;&nbsp;"author": "string"

}

\`\`\`

\## Comments teenus (port 4000)

\### POST /posts/:id/comments

Lisab kommentaari postitusele

**Body:**

\`\`\`json

{

&nbsp;&nbsp;"content": "string",

&nbsp;&nbsp;"author": "string"

}

\`\`\`

\## Query teenus (port 5003)

\### GET /api/posts

Tagastab kõik postitused koos kommentaaridega

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBbW9ub2xpaXRyYWtlbmR1cyUzQSUzQUdyZWVuQmVhbjAzMDM=" repo-name="monoliitrakendus"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
