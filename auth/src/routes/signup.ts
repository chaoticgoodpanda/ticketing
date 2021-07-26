import express, {Request, Response } from 'express';
import {body, validationResult } from "express-validator";

const router = express.Router();

router.post('/api/users/signup', [
  //insertion of validation steps
  body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters')
], (req: Request, res: Response) => {
    const errors = validationResult(req);
    
    //returns errors as array that can be transmitted as JSON data
    if(!errors.isEmpty()) {
        throw new Error('Invalid email or password');
    }
    
    const { email, password } = req.body;
    
    console.log('Creating a user...');
    throw new Error('Error connecting to database');
    
    
    res.send({});
    
    
    
});

export { router as signupRouter };