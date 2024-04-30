/* eslint-disable max-lines */
import { afterAll, beforeAll, describe, test } from '@jest/globals';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
    host,
    httpsAgent,
    port,
    shutdownServer,
    startServer,
} from '../testserver';
import { type GraphQLRequest } from '@apollo/server';
import { type GraphQLResponseBody } from './auto-query.resolver.test.js';
import { HttpStatus } from '@nestjs/common';
import { loginGraphQL } from '../login';

// eslint-disable-next-line jest/no-export
export type GraphQLQuery = Pick<GraphQLRequest, 'query'>;

// TESTS
// eslint-disable-next-line max-lines-per-function
describe('GraphQL Mutations', () => {
    let client: AxiosInstance;
    const graphqlPath = 'graphql';

    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/`;
        client = axios.create({
            baseURL,
            httpsAgent,
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('Neues Auto', async () => {
        // given
        const token = await loginGraphQL(client);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const authorization = { Authorization: `Bearer ${token}` };
        const body: GraphQLQuery = {
            query: `
            mutation Create {
    create(
        input: {
            modellbezeichnung: "A8"
            hersteller: AUDI
            fin: "WAUZZZ8P4FA098768"
            kilometerstand: 0
            auslieferungstag: "2022-02-01 00:00:00"
            grundpreis: 5000
            istAktuellesModell: true
            getriebeArt: MANUELL
            eigentuemer: {
                eigentuemer: "Max Mustermann"
                geburtsdatum: "03.05.1999"
                fuehrerscheinnummer: "DEF789"
            }
            ausstattungen: [{
        bezeichnung: "Beleuchtung",
        preis: 23.99
        verfuegbar: true
      }]
        }
    ) {
        id
    }
}
            `,
        };
        const response: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
            { headers: authorization },
        );
        const { status, headers, data } = response;

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu); // eslint-disable-line sonarjs/no-duplicate-string
        expect(data.data).toBeDefined();

        const { create } = data.data!;

        expect(create).toBeDefined();
        expect(create.id).toBeGreaterThan(0);
    });

    // eslint-disable-next-line max-lines-per-function
    test('Neues Auto mit ungültigen Daten', async () => {
        // given
        const token = await loginGraphQL(client);
        const authorization = { Authorization: `Bearer ${token}` }; // eslint-disable-line @typescript-eslint/naming-convention
        const body: GraphQLQuery = {
            query: `
            mutation Create {
    create(
        input: {
            modellbezeichnung: "A8"
            hersteller: AUDI
            fin: "WAUZZZ8P4FA098766"
            kilometerstand: -1
            auslieferungstag: "2022-02-01 00:00:00"
            grundpreis: -1
            istAktuellesModell: true
            getriebeArt: MANUELL
            eigentuemer: {
                eigentuemer: "Max Mustermann"
                geburtsdatum: "03.05.1999"
                fuehrerscheinnummer: "DEF789"
            }
            ausstattungen: [{
        bezeichnung: "Beleuchtung",
        preis: 23.99
        verfuegbar: true
      }]
        }
    ) {
        id
    }
}
            `,
        };
        const expectedMsg = [
            expect.stringMatching(/^grundpreis /u),
            expect.stringMatching(/^kilometerstand /u),
        ];

        const response: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
            { headers: authorization },
        );

        // then
        const { status, headers, data } = response;

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.create).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;

        expect(error).toBeDefined();

        const { message } = error;
        const messages: string[] = message.split(',');

        expect(messages).toBeDefined();
        expect(messages).toHaveLength(expectedMsg.length);
        expect(messages).toEqual(expect.arrayContaining(expectedMsg));
    });

    // ------------------------------------------------------------------------

    test('Auto mit ID 1 aktualisieren', async () => {
        // given
        const token = await loginGraphQL(client);
        const authorization = { Authorization: `Bearer ${token}` }; // eslint-disable-line @typescript-eslint/naming-convention
        const body: GraphQLQuery = {
            query: `
            mutation Update {
    update(
        id: 2
        version: "1"
        input: {
            modellbezeichnung: "VW BUS"
            hersteller: VOLKSWAGEN
            fin: "WAUZZZ8P4FA098761"
            kilometerstand: 123456
            auslieferungstag: "2023-07-01"
            grundpreis: 123345.4
            istAktuellesModell: false
            getriebeArt: MANUELL
            eigentuemer: {
                eigentuemer: "Petra Musterfrau"
                geburtsdatum: "2023-07-01"
                fuehrerscheinnummer: "GHI011"
            }
        }
    ) {
        version
    }
}
            `,
        };

        const response: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
            { headers: authorization },
        );

        const { status, headers, data } = response;

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();

        const { update } = data.data!;

        expect(update.version).toBe(1);
    });

    test('Auto mit ID 1 mit ungültigen Daten aktualisieren', async () => {
        const token = await loginGraphQL(client);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const authorization = { Authorization: `Bearer ${token}` };
        const id = '1';
        const body: GraphQLQuery = {
            query: `
            mutation Update {
    update(
        id: "${id}"
        version: "1"
        input: {
            modellbezeichnung: "VW BUS"
            hersteller: VOLKSWAGEN
            fin: "WAUZZZ8P4FA098761"
            kilometerstand: -1
            auslieferungstag: "2023-07-01"
            grundpreis: 123345.4
            istAktuellesModell: false
            getriebeArt: MANUELL
            eigentuemer: {
                eigentuemer: "Petra Musterfrau"
                geburtsdatum: "2023-07-01"
                fuehrerscheinnummer: "GHI011"
            }
        }
    ) {
        version
    }
}
            `,
        };
        const expectedMsg = [
            expect.stringMatching(/^kilometerstand /u),
        ];

        const response: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
            { headers: authorization },
        );
        const { status, headers, data } = response;

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.update).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { message } = error;

        const messages: string[] = message.split(',');

        expect(messages).toBeDefined();
        expect(messages).toHaveLength(expectedMsg.length);
        expect(messages).toEqual(expect.arrayContaining(expectedMsg));
    });

    test('Nicht-Vorhandenes Auto(ID420) aktualisieren', async () => {
        const token = await loginGraphQL(client);
        const authorization = { Authorization: `Bearer ${token}` }; // eslint-disable-line @typescript-eslint/naming-convention
        const id = '420';
        const body: GraphQLQuery = {
            query: `
            mutation Update {
    update(
        id: "${id}",
        version: "1"
        input: {
            modellbezeichnung: "VW BUS"
            hersteller: VOLKSWAGEN
            fin: "WAUZZZ8P4FA098761"
            kilometerstand: 123456
            auslieferungstag: "2023-07-01"
            grundpreis: 123345.4
            istAktuellesModell: false
            getriebeArt: MANUELL
            eigentuemer: {
                eigentuemer: "Petra Musterfrau"
                geburtsdatum: "2023-07-01"
                fuehrerscheinnummer: "GHI011"
            }
        }
    ) {
        version
    }
}
            `,
        };

        const response: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
            { headers: authorization },
        );

        const { status, headers, data } = response;

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.update).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;

        expect(error).toBeDefined();

        const { message, path, extensions } = error;

        expect(message).toBe(
            `Es gibt kein Auto mit der ID: ${id.toLowerCase()}.`,
        );
        expect(path).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
        expect(path!![0]).toBe('update');
        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('BAD_USER_INPUT');
    });

    test('Auto löschen', async () => {
        const token = await loginGraphQL(client);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const authorization = { Authorization: `Bearer ${token}` };
        const body: GraphQLQuery = {
            query: `
                mutation {
  delete(id: "6")
}
            `,
        };
        const response: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
            { headers: authorization },
        );
        const { status, headers, data } = response;

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const deleteMutation = data.data!.delete;

        expect(deleteMutation).toBe(true);
    });
});
/* eslint-enable max-lines*/
