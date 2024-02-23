const processField = (field, value, query) => {
    const individualFields = field.split(".")
    let obj = query
    let i = 0
    for(const field of individualFields) {
        if(i == individualFields.length - 1) obj[field] = value
        else {
            if(!obj[field] || obj[field] === true) obj[field] = {}
            obj = obj[field]
        }
        i++
    }
}

const getField = (field, query) => {
    const individualFields = field.split(".")
    let obj = JSON.parse(JSON.stringify(query))
    let i = 0
    for(const field of individualFields) {
        if(i == individualFields.length - 1) return obj[field]
        else {
            if(!obj[field] || obj[field] === true) return undefined
            obj = obj[field]
        }
        i++
    }
}

class QueryModel {
    constructor(name) {
        this.name = name
        this.postProcessors = []
        this.queryObj = {}
    }

    select(fields) {
        for(const field of fields) processField(field, true, this.queryObj)
        return this
    }

    where(q, a) {
        const conditions = q instanceof Array ? q : [[q, a]]
        for(const [newQ, newA] of conditions) {
            if(!newA.__matcher) throw Error("Use of a matcher is required for the where clause")
            processField(newQ, newA, this.queryObj)
        }
        return this
    }

    findById(a) {
        return this
            .where("_id", Eq(a))
            .postProcessor("_id", PostProcessor("first"))
    }

    postProcessor(q, p) {
        for(const a of p instanceof Array ? p : [p])
            if(!a.aggregator) throw Error("Use of a postprocessor is required for the postprocessor clause")
        if(q == this.name || q == "_id") {
            this.postProcessors.push(...(p instanceof Array ? p : [p]))
            return this
        }
        const res = getField(q, this.queryObj)?.__postprocessors
        const postProcessorArray = p instanceof Array ? [...p, ...(res ?? [])] : [...(res ?? []), p]
        if(res) processField(`${q}.__postprocessors`, postProcessorArray, this.queryObj)
        else processField(
            q,
            {
                __postprocessors: postProcessorArray,
                query: getField(q, this.queryObj),
            }, 
            this.queryObj
        )
        return this
    }

    exec() {
        if(this.postProcessors.length) return {
            [this.name]: {__postprocessors: this.postProcessors, query: this.queryObj}
        }
        else return {[this.name]: this.queryObj}
    }
}

class QueryBuilder {
    constructor(queries = []) {
        this.queries = queries
    }

    model(name) {
        this.queries.push(new QueryModel(name))
    }

    exec() {
        const results = this.queries
        const duplicates = {}
        for(const res of results) duplicates[res.name] = []
        for(const res of results) duplicates[res.name].push(res.exec())

        const nOfEverything = [[]]
        let i = 0
        const maxObjectKeySize = Object.values(duplicates).map(arr => arr.length).reduce((a, b) => Math.max(a, b), 0)

        while(i < maxObjectKeySize) {
            for(const k in duplicates) {
                const val = duplicates[k]
                if(val[i]) nOfEverything[nOfEverything.length - 1].push(val[i])
            }
            nOfEverything.push([])
            i++
        }

        const filteredNOfEverything = nOfEverything.filter(arr => arr.length > 0)
        return filteredNOfEverything.map(obj => obj.reduce((a, b) => ({...a, ...b}), {}))
    }
}

const AbstractQuery = f => (...queries) => f({queries: new QueryBuilder(queries).exec()})

const Query = AbstractQuery(async x => x)

// Matcher Helpers
const Matcher = (matcher, data) => ({ __matcher: matcher, data })
const Eq = data => Matcher("eq", data)

// PostProcessor Helpers
const PostProcessor = (aggregator, args=[], as=undefined) => ({ aggregator, arguments: args, as })


// Query(
//     new QueryModel("User")
//         .select(["streak", "submissions.date"])
//         .where("_id", Eq("64a833ae7e7230302126d3ba")),

//     new QueryModel("Exercise")
//         .select(["name", "breath", "texts", "image"])
//         .where("submissions.user._id", Eq("64a833ae7e7230302126d3ba"))
//         .where("submissions.date", Eq("2023-07-07"))
//         .postProcessor("submissions", PostProcessor("exists", [], "submitted"))
//         .postProcessor("submissions", PostProcessor("ignore")),

//     new QueryModel("Blog")
//         .select(["title", "subtitle", "text", "thumbnail", "video", "duration", "date"]),
// ).then(data => console.log(JSON.stringify(data)))

module.exports = {
    Query,
    QueryModel,
    QueryBuilder,

    Matcher,
    Eq,

    PostProcessor,
};
