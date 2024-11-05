# Welcome: This is an SIMPLE IMAGE EDITOR project!

## Deployed version

https://simple-image-editor-s3im.vercel.app/

## Main motivation

The main motivation was to be able to create a modern application using nextjs 15, NeonDB, Piñata for uploads and manipulate images using HTML Canvas.

## Main features

This first version comes with:

### 1 - View Galery

This page is the galery for the current user. On it we can see all the Images saved in the cloud, and download, and delete, and even start a new Image editor using this image as base.

![Image Galery](doc/galery.png)

### 2 - Image Editor

This page is the editor itself. All begins with an upload of a Image.
![Image Uploader](doc/upload.png)

Once we have the image in the canvas we can use many tools to manipulate the viewport, like:

- Image Rotation: this tool will rotate only de image by 90º for both orientation.
- Drawing Pencil: this tool allows the user to choose a color and paint on top of the image.
- Zoom: this tool will change the size of all objects in the image creator.
- Undo and Redo: this tool allows the user to undo actions and even to redo it.
- Reset: this tool will allow the user to erase all modifications and get back to having only the image in the canvas.

![Image Editor](doc/editor.png)

## Technologies

- [Nexjs 15](https://nextjs.org/)
- [Neon - DB](https://neon.tech/)
- [Pinata](https://pinata.cloud/)
- [Zustang](https://github.com/pmndrs/zustand)

## Getting Started

To start this project we have to create account on 2 platforms: Neon and Pinata. We will need that to be able to get the secrets and tokens.

As soon as we created the account we can rename the file _.example.env.local_ to .env.local.
On it we have to fill the informations from the APIs:

### Neon

We have to create a new project, than go to Dashboard and get the connection string.
It will be a string with a simular format of the example below.

_postgresql://neondb_owner:xxxxxxxxxx@xxxxxxxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require_

### Pinata

On Piñata we have to create a workspace create a API Key and a Gateway.

When creating the API key we can choose Admin and Generate. The next page will have all the keys we need to put in the .env.local.

# Running the project

First, we have to create the DB, migrate it and seed it:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

We can confirm the tables are created in the Neon Tables. If we look in the tenants table we should see the Default tenant and in the users the Guest.

Now it's fun time! Let's start the server:

```bash
npm i
npm run dev
```

_Note: When running any install it's important to keep im mind that Nextjs, at this date, is using a release candidate version of React, but other libraries not necessarily. To fix the issues in the install we should use --legacy-deps. In this project we already have a .npmrc with legacy-peer-deps enabled by default._

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Next Steps

- Deploy on Vercel
- Enable Clerk for Authentication, Authorization and User creation. To be able to create user you have to configure a service to help you with the webhook. I've been using ngrok.
