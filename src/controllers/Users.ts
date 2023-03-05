import { NextFunction, Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import Users from '../models/Users';
import { invalidateSession } from '../common/sessionHandler';
import { setSessionCookie } from '../common/setSessionCookie';

export interface PaginatedResponse extends Response {
    paginatedResults?: [];
}

export interface UserRequest extends Request {
    user?: {
        name: string;
        email: string;
        userId: string;
        role: string;
        sessionId: string;
    };
}

// Signup user
const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role = 'user' } = req.body;
    const hashedPassword = await hash(password, 10);

    const signUp = new Users({name, email, password: hashedPassword, role});

    return Users.find({email})
        .then((user: any) => {
            if(user.length) {
                res.status(500).json({message: {
                    msgBody: 'Sorry! User with this email is already registered.',
                    msgError: true
                }})
            } else {
                signUp.save()
                    .then(() => {
                        Users.find({ email })
                            .then((user: any) => {
                                const session = setSessionCookie(email, user, res);

                                res.json({message: {
                                    msgBody: 'Account Created',
                                    msgError: false,
                                    session,
                                    user
                                }})
                            })
                            .catch((err: any) => res.status(400).json({message: {
                                msgBody: 'Something went wrong',
                                msgErrorDesc: `${err}`,
                                msgError: true
                            }}))
                    })
                    .catch(err => res.status(400).json({message: {
                        msgBody: 'Unable to Sign Up',
                        msgErrorDesc: `${err}`,
                        msgError: true
                    }}))
            }
        })
        .catch((err: any) => res.status(400).json({message: {
            msgBody: 'Something went wrong',
            msgErrorDesc: `${err}`,
            msgError: true
        }}))
}

// Login user
const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    Users.find({ email })
    .then(async (user: any) => {
        if (!user.length) {
            res.status(500).json({message: {
                msgBody: 'Sorry! No user with this email id exists!',
                msgError: true
            }})
        } else {
            const validPassword = await compare (password, user[0].password)
            if(!validPassword) {
                res.status(500).json({message: {
                    msgBody: 'Incorrect Password',
                    msgError: true
                }})
            } else {
                Users.find({ email })
                .then((user: any) => {
                    const session = setSessionCookie(email, user, res);

                    res.json({message: {
                        msgBody: 'Logged In',
                        msgError: false,
                        session,
                        user
                    }})
                })
                .catch((err: any) => res.status(400).json({message: {
                    msgBody: 'Something went wrong',
                    msgErrorDesc: `${err}`,
                    msgError: true
                }}))
            }
        }
    })
    .catch((err: any) => res.status(400).json({message: {
        msgBody: 'Something went wrong',
        msgErrorDesc: `${err}`,
        msgError: true
    }}))
}

// Get list of all users
const getAllUsers = (req: Request, res: PaginatedResponse, next: NextFunction) => {
    return Users.find()
        .then(() => res.status(200).json(res.paginatedResults))
        .catch((error) => res.status(500).json({ error }));
};

// Logout user
const logout = (req: UserRequest, res: Response) => {
    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
    });
  
    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });
  
    if(!req?.user) {
        return res.json({message: {
            msgBody: 'No active session',
            msgError: true
        }})
    }
    const session = invalidateSession(req?.user?.sessionId);
  
    return res.json({message: {
        msgBody: 'Logged Out',
        msgError: false,
        session,
    }});
}

export default { signUp, login, getAllUsers, logout };