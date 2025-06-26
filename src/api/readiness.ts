import type {Request, Response } from "express";

export async function handlerReadiness(_:Request, res: Response){
	res.set('Content-Type','text/plain; charset=utf-i');
	res.send('OK');
	res.end();
}
