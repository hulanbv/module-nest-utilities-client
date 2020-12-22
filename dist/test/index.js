"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useAll_1 = require("hooks/useAll");
const useById_1 = require("hooks/useById");
const useDelete_1 = require("hooks/useDelete");
const useMany_1 = require("hooks/useMany");
const usePatch_1 = require("hooks/usePatch");
const usePost_1 = require("hooks/usePost");
const usePut_1 = require("hooks/usePut");
const nest_utilities_client_1 = require("nest-utilities-client");
class S extends nest_utilities_client_1.CrudService {
    constructor() {
        super('');
    }
}
const service = new S();
const all = useAll_1.useAll(service);
const byId = useById_1.useById(service);
const delet = useDelete_1.useDelete(service);
const many = useMany_1.useMany(service);
const patch = usePatch_1.usePatch(service);
const post = usePost_1.usePost(service);
const put = usePut_1.usePut(service);
//# sourceMappingURL=index.js.map