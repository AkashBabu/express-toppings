var chai = require("chai")
var chaiHttp = require("chai-http")
var mongojs = require("mongojs")
var db = mongojs("sh_test")
var server = require("./server")
var qs = require("querystring")

var should = chai.should()
chai.use(chaiHttp)
var request = chai.request(server)

var userColl = "users"

describe("CRUD on Users", function () {
    var users = [{
        name: 'test1',
        email: 'test1@mail.com'
    }, {
        name: 'test2',
        email: 'test1@mail.com'
    }, {
        name: 'test3',
        email: 'test1@mail.com'
    }]

    before(done => {
        db.collection(userColl).remove({}, done)
    })

    var iUsers = []
    var ids = [];
    beforeEach((done) => {
        db.collection(userColl).insert(users, (err, result) => {
            if (!err) {
                iUsers = result
                ids = result.map(user => user._id)
            }
            done(err)
        })
    })

    afterEach(done => {
        db.collection(userColl).remove({}, done);
    })

    after((done) => {
        db.dropDatabase(function () {
            done();
        })
    })

    it("should list ALL users on /users GET", (done) => {
        request
            .get("/users")
            .end((err, res) => {
                res.should.have.status(200)
                res.body.error.should.be.eql(false)
                res.body.data.should.be.a("array")
                res.body.data.length.should.be.eql(3)
                done()
            })
    })

    it("should get a SINGLE user on /users/{id} GET", (done) => {
        var user = iUsers[0]
        request
            .get("/users/" + user._id)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.error.should.be.eql(false)
                res.body.data.name.should.be.eql(user.name)
                res.body.data.email.should.be.eql(user.email)
                done()
            })
    })

    it("should create a SINGLE user on /user POST", (done) => {
        var user = users[0]

        request
            .post('/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.error.should.not.be.ok

                done()
            })
    })

    it("should update a SINGLE user on /user/{id} PUT", (done) => {
        var user = iUsers[0]
        var update = {
            name: "test-updated"
        }
        request
            .put("/users/" + user._id)
            .send(update)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.error.should.not.be.ok

                done()
            })
    })
    it("should remove a SINGLE user on /user/{id} DELETE", (done) => {
        var user = iUsers[0]
        request
            .delete("/users/" + user._id)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.error.should.not.be.ok

                done();
            })
    })

    it("should delete Multiple Users on /user Delete", done => {
        var lIds = ids.slice()
        var query = ""
        lIds.forEach(id => {
            query += "&ids=" + id
        })

        // console.log("query:", query);
        request.del("/users?" + query)
            .end((err, res) => {
                should.not.exist(err)

                res.should.have.status(200)

                done();
            })
    })

    // it("should return method not allowed error for any other methods", (done) => {
    //     request
    //         .options("/users/")
    //         .end((err, res) => {
    //             res.should.have.status(405)
    //             res.body.error.should.be.ok
    //             res.body.data.should.be.eql("Method Not Allowed")
    //             done()
    //         })
    // })

    it("should forward a request if handler is not present", (done) => {
        request
            .get("/users/get/names")
            .end((res) => {
                res.should.have.status(404)
                done()
            })
    })
})