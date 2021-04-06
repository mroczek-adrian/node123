const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Gamer:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the Gamer
 *         title:
 *           type: string
 *           description: The Gamer title
 *         author:
 *           type: string
 *           description: The Gamer author
 *       example:
 *          id: 01
 *          title: Score = 100
 *          author: Allen B. Downey 
 * 
 */

 /**
  * @swagger
  * tags:
  *   name: Gamers
  *   description: The Gamers managing API
  */

/**
 * @swagger
 * /Gamers:
 *   get:
 *     summary: Returns the list of all the Gamers
 *     tags: [Gamers]
 *     responses:
 *       200:
 *         description: The list of the Gamers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gamer'
 */

router.get("/", (req, res) => {
	const Gamers = req.app.db.get("Gamers");

	res.send(Gamers);
});

/**
 * @swagger
 * /Gamers/{id}:
 *   get:
 *     summary: Get the Gamer by id
 *     tags: [Gamers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Gamer id
 *     responses:
 *       200:
 *         description: The Gamer description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gamer'
 *       404:
 *         description: The Gamer was not found
 */

router.get("/:id", (req, res) => {
  const Gamer = req.app.db.get("Gamers").find({ id: req.params.id }).value();

  if(!Gamer){
    res.sendStatus(404)
  }

	res.send(Gamer);
});

/**
 * @swagger
 * /Gamers:
 *   post:
 *     summary: Create a new Gamer
 *     tags: [Gamers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gamer'
 *     responses:
 *       200:
 *         description: The Gamer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gamer'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
	try {
		const Gamer = {
			id: nanoid(idLength),
			...req.body,
		};

    req.app.db.get("Gamers").push(Gamer).write();
    
    res.send(Gamer)
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /Gamers/{id}:
 *  put:
 *    summary: Update the Gamer by the id
 *    tags: [Gamers]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Gamer id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Gamer'
 *    responses:
 *      200:
 *        description: The Gamer was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Gamer'
 *      404:
 *        description: The Gamer was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
	try {
		req.app.db
			.get("Gamers")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("Gamers").find({ id: req.params.id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /Gamers/{id}:
 *   delete:
 *     summary: Remove the Gamer by id
 *     tags: [Gamers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Gamer id
 * 
 *     responses:
 *       200:
 *         description: The Gamer was deleted
 *       404:
 *         description: The Gamer was not found
 */

router.delete("/:id", (req, res) => {
	req.app.db.get("Gamers").remove({ id: req.params.id }).write();

	res.sendStatus(200);
});

module.exports = router;