import { Model, Document } from 'mongoose';

interface IResult {
    next?: {};
    previous?: {};
    results?: any[];
    totalCount?: number;
    msgError?: boolean;
}

const paginatedResults = <T extends Document>(model: Model<T>) => {
    return async (req: any, res: any, next: any) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const completed = req.query.completed;
        const sortField = req.query.sort || '_id';

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results: IResult = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            let filteredResult = results.results
            if (completed) {
                const completedStatus = completed === 'true';
                filteredResult = results.results.filter((eachTodo: any) => eachTodo.isCompleted === completedStatus);
            }
            
            const sortedResult = filteredResult.sort((a: any, b: any) => a[sortField] - b[sortField]);
            results.results = sortedResult
            results.totalCount = sortedResult.length
            results.msgError = false;
            res.paginatedResults = results
            next();
        } catch (e: any) {
            res.status(500).json({ message: e.message })
        }
    }
}

export = paginatedResults