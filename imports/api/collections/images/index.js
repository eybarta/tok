import gm from 'gm';
import {Mongo} from 'meteor/mongo';
import {UploadFS} from 'meteor/jalik:ufs';
import {GridFSStore} from 'meteor/jalik:ufs-gridfs';
import {LocalStore} from 'meteor/jalik:ufs-local';

export const Images = new Mongo.Collection('images');

export const ImageStore = new GridFSStore({
    collection: Images,
    name: 'images',
    path: './ufs/images',
    // transformWrite(from, to, fileId, file) {
    //     // console.log("transformWrite >> ", from, " :::: ", to, " ::: ", fileId, " :::: ", file);
    //     // if (gm) {
    //     //     gm(from)
    //     //         // .resize(400, 400)
    //     //         .gravity('Center')
    //     //         .extent(400, 400)
    //     //         .quality(75)
    //     //         .stream().pipe(to);
    //     // } else {
    //     //     console.error("gm is not available", file);
    //     // }
    //     from.pipe(to); // this returns the raw data
        
    // },
    transformRead(from, to, fileId, file, request) {
        from.pipe(to); // this returns the raw data
    },
});