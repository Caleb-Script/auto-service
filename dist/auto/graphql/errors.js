import { GraphQLError } from 'graphql';
export class BadUserInputError extends GraphQLError {
    constructor(message, exception) {
        super(message, {
            originalError: exception,
            extensions: {
                code: 'BAD_USER_INPUT',
            },
        });
    }
}
//# sourceMappingURL=errors.js.map