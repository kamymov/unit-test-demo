import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async createUser(createUserInput: CreateUserInput) {
    const { username, passowrd } = createUserInput;

    const ExistUser = await this.usersRepository.findOneBy({ username });

    if (ExistUser) {
      throw new HttpException('This user is alredy exist', 406);
    }

    const hashedPassword = await bcrypt.hash(passowrd, 12);

    const user = {
      username,
      password: hashedPassword,
    };

    await this.usersRepository.insert(user);

    return user;
  }

  findUsers() {
    return this.usersRepository.find();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
