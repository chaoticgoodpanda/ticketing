import express from 'express';
import {currentUser} from "@mikeytickets/common";

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    //currentUser will be the actual JSON payload
    res.send({currentUser: req.currentUser || null});

});

export { router as currentUserRouter };