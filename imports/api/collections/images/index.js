import {Mongo} from 'meteor/mongo';
import {UploadFS} from 'meteor/jalik:ufs';
import {GridFSStore} from 'meteor/jalik:ufs-gridfs';
import {LocalStore} from 'meteor/jalik:ufs-local';

export const Images = new Mongo.Collection('images');

export const ImageStore = new GridFSStore({
    collection: Images,
    name: 'images',
    path: './ufs/images',
    chunkSize: 1024 * 1000,
    // Apply a filter to restrict file upload
    filter: new UploadFS.Filter({
        minSize: 1,
        maxSize: 1024 * 1000, // 1MB,
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png', 'svg']
    }),
    transformRead(from, to, fileId, file, request) {
        from.pipe(to); // this returns the raw data
    },
    // Transform file when writing
    transformWrite(from, to, fileId, file) {
        if (gm) {
            gm(from)
                .resize(900)
                .gravity('Center')
                .quality(88)
                .stream().pipe(to);
        } else {
            console.error("gm is not available", file);
        }
    },
    onValidate: function (file) {
        // Here 'file' contains file metadata sent by the client, we need to get
        // the disk path to the uploaded temp file to give it to gm.
        // let gm = Npm.require('gm');
        
        const tempFilePath = UploadFS.getTempFilePath(file._id);

        // console.log('tempFilePath >> ', tempFilePath)
         
        // Since the 'identify' function below is executed in a callback,
        // we cannot directly throw an exception from it, because the exception would
        // be catched by the server and not by ufs. We need to throw the exception
        // from this onValidate function, so that ufs can catch the exception and
        // trigger the cleanup process/report the error to the client.
        // We do this by defining a future and waiting for it in onValidate, and having
        // the future throw the exception instead of throwing it directly from
        // the 'identify' function.
        var Future = Npm.require('fibers/future');
        let future = new Future();
        
        // identify will return an error if the content of the file is not an image.
        // If it is an image, then details on the image file will be in data.
        const identify = function (err, data) {
            if (err) {
                console.log("ERR >> ", err, data);
                // Throw an exception to inform the client and trigger the cleanup process
                future.throw(new Meteor.Error('not-an-image', 'The file is not an image'));
            } else {
                // We need to tell our future to return, or else it would stay stuck.
                future.return();
            }
        };
        gm(tempFilePath).identify(identify);
        
        // Wait for 'identify' to complete, and either return or throw the exception
        return future.wait();
    },
    permissions: new UploadFS.StorePermissions({
        insert(userId, doc) {
            console.log("INSERT >> ", userId, " :: ", doc);
            return userId;
        },
        update(userId, doc) {
            return userId === doc.userId;
        },
        remove(userId, doc) {
            return userId === doc.userId;
        }
    })
});