import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "@purple-miroservices/database";
import { User } from "../models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UserRepository extends AbstractRepository<User> {
    protected logger =new Logger(UserRepository.name);
    
    constructor(@InjectModel(User.name) userModel: Model<User>) {
        super(userModel);
      }
}