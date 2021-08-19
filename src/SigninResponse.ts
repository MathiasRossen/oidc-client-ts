// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Timer, UrlUtility } from "./utils";

const OidcScope = "openid";

export class SigninResponse {
    public readonly code: string;

    // will be set from ResponseValidator
    public state: string |  undefined;

    // will be set from ResponseValidator
    public error: string |  undefined;
    public error_description: string |  undefined;
    public error_uri: string |  undefined;

    // will be set from ResponseValidator
    public id_token: string |  undefined;
    public session_state: string |  undefined;
    public access_token: string |  undefined;
    public token_type: string |  undefined;
    public scope: string |  undefined;
    public expires_at: number | undefined

    // will be set from ResponseValidator
    public profile: any |  undefined;

    public constructor(url?: string, delimiter = "#") {

        const values = UrlUtility.parseUrlFragment(url, delimiter);

        this.error = values.error;
        this.error_description = values.error_description;
        this.error_uri = values.error_uri;

        this.code = values.code;
        this.state = values.state;

        this.id_token = values.id_token;
        this.session_state = values.session_state;
        this.access_token = values.access_token;
        this.token_type = values.token_type;
        this.scope = values.scope;
        this.expires_in = parseInt(values.expires_in);

        this.profile = undefined;
    }

    public get expires_in(): number | undefined {
        if (this.expires_at) {
            const now = Timer.getEpochTime();
            return this.expires_at - now;
        }
        return undefined;
    }
    public set expires_in(value: number | undefined) {
        if (value && value > 0) {
            const expires_in = Math.floor(value);
            const now = Timer.getEpochTime();
            this.expires_at = now + expires_in;
        }
    }

    public get expired() {
        const expires_in = this.expires_in;
        if (expires_in !== undefined) {
            return expires_in <= 0;
        }
        return undefined;
    }

    public get scopes() {
        return (this.scope || "").split(" ");
    }

    public get isOpenIdConnect() {
        return this.scopes.indexOf(OidcScope) >= 0 || !!this.id_token;
    }
}
