function responseJson(message, right, data = {}) {
  return Object.assign({ message, right }, data);
}

function ProblemModel(id, input){
  return {id, input};
}

function getValuesFromObject(obj){ // minha versão do Object.values
  return Object.keys(obj).reduce((acum, curr) => acum.concat(obj[curr]), []);
}


function ProblemController(){
  this.problems_storage = {};

  const findProblemById = (id) => {
    return this.problems_storage[id];
  };

  const insertProblem = (problemObject) => {
    this.problems_storage[problemObject.id] = problemObject;
  };


  /**
   * GET /problems
   */
  this.get = (req, res, next) => {
    res.send(200, responseJson('list of problems', true, { problems: getValuesFromObject(this.problems_storage) }));

    return next();
  };
  
  /**
   * GET /problems/:id
   */
  this.getById = (req, res, next) => {
    const found = findProblemById(req.params.id);
    if (found) res.send(200, responseJson('problem exist', true, { problem: found }));
    else res.send(404, responseJson('problem not found.', false));

    return next();
  };

  /**
   * POST /problems
   * { id: Number, input: String }
   */
  this.post = (req, res, next) => {
    const bparams = req.body;
    if (!bparams || !bparams.hasOwnProperty('id') || !bparams.hasOwnProperty('input') || !Number.isInteger(bparams.id)) {
      res.send(500, responseJson('require "id" and "input" parameters.', false));
    }
    else {
      const newProblem = new ProblemModel(bparams.id, bparams.input);
      insertProblem(newProblem);
      res.send(201, responseJson('new problem insert', true, { problem: newProblem }));
    }

    return next();
  };

  /**
   * DELETE /problems/:id
   */
  this.delete = (req, res, next) => {
    const idToDelete = req.params.id;
    if (Number.isInteger(idToDelete)){
      const problemDeleted = this.problems_storage[idToDelete];
      if (problemDeleted) {
        delete this.problems_storage[idToDelete];
        res.send(200, responseJson('problem ' + idToDelete + ' deleted', true, problemDeleted));
      }
      else {
        res.send(404, responseJson('problem not found!', false));
      }
    }
    else {
      res.send(500, responseJson('require problem id as number', false));
    }

    return next();
  };

}


//------------------------------------//
module.exports = new ProblemController();
//------------------------------------//