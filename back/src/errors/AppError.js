exports.AppError = class extends Error {
    constructor (message,statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        switch (statusCode) {
            case 400 : {
                this.name = 'BadRequestError';
                break;
            }
            case 401 : {
                this.name = 'AuthenticationError';
                break;
            }
            case 403 : {
                this.name = 'ForbiddenError';
                break;
            }
            case 404 : {
                this.name = 'NotFoundError';
                break;
            }
            case 409 : {
                this.name = 'ConflictError';
                break;
            }

        }
    } 
}