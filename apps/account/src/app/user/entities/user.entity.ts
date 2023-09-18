import { UnprocessableEntityException } from "@nestjs/common";
import { IUser, IUserCourse, PurchaseState, UserRole } from "@purple-miroservices/interfaces";
import { compare, genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {
	_id?: string;
	displayName?: string;
	email: string;
	passwordHash: string;
	role: UserRole;
	courses?: IUserCourse[];

	constructor(user: IUser) {
		this._id = user._id;
		this.displayName = user.displayName;
		this.email = user.email;
		this.role = user.role;
		this.passwordHash = user.passwordHash;
		this.courses = user.courses;
	}
	public async setPassword(password: string) {
		const salt = await genSalt(10);
		this.passwordHash = await hash(password, salt);
		return this;
	}

	public validatePassword(password: string) {
		return compare(password, this.passwordHash);
	}

	public updateProfile(user: Partial<IUser>) {
		Object.assign(this, user);
		return this;
	}

	public getUserPublicProfile() {
		return {
			displayName: this.displayName,
			email: this.email,
			role: this.role,
			courses: this.courses,
		}
	}

	public setCourseState(courseId: string, state: PurchaseState){
		const candidate = this.courses.find(c => c._id === courseId);
		if(!candidate){
			this.courses.push({
				courseId,
				purchaseState: state,
			});
			return this;
		}

		if(state === PurchaseState.Canceled){
			this.courses.filter(c => c._id !== courseId);
			return this;
		}

		this.courses = this.courses.map(c => {
			if(c._id === courseId){
				c.purchaseState = state;
				return c;
			}
			return c;
		});
		return this;
	}
}