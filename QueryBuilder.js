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

    postProcessor(q, p) {
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
        return {[this.name]: this.queryObj}
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
        return this.queries.map(q => q.exec())
    }
}

const Query = (...queries) => ({queries: new QueryBuilder(queries).exec()})

// Matcher Helpers
const Matcher = (matcher, data) => ({ __matcher: matcher, data })
const Eq = data => Matcher("eq", data)

// PostProcessor Helpers
const PostProcessor = (aggregator, args=[], as=undefined) => ({ aggregator, arguments: args, as })


console.log(
    JSON.stringify(Query(
        new QueryModel("User")
            .select(["streak", "submissions.date"])
            .where("_id", Eq("64a833ae7e7230302126d3ba")),

        new QueryModel("Exercise")
            .select(["name", "breath", "texts", "image"])
            .where("submissions.user._id", Eq("64a833ae7e7230302126d3ba"))
            .where("submissions.date", Eq("2023-07-07"))
            .postProcessor("submissions", PostProcessor("exists", [], "submitted"))
            .postProcessor("submissions", PostProcessor("ignore")),

        new QueryModel("Blog")
            .select(["title", "subtitle", "text", "thumbnail", "video", "duration", "date"]),
    ))
)

module.exports = {
    Query,
    QueryModel,
    QueryBuilder,

    Matcher,
    Eq,

    PostProcessor,
}