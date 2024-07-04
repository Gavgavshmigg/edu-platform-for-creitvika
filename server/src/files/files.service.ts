import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

const requiredExts = ['.jpeg', '.jpg', '.png'];
const maxSize = 10 * 1024 * 1024; //10 mb

@Injectable()
export class FilesService {

    async createFile(file: Express.Multer.File): Promise<string> {
        try {
            const fileExt = path.extname(file.originalname);
            if (!requiredExts.includes(fileExt)) {
                throw new HttpException('Формат файла не поддерживается', HttpStatus.BAD_REQUEST);
            }
            if (file.size > maxSize) {
                throw new HttpException('Слишком большой файл', HttpStatus.BAD_REQUEST);
            }
            const fileName = uuid.v4() + fileExt;
            const filePath = path.resolve(__dirname, '..', '..', 'static');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return fileName;
        } catch(e) {
            if (e.response && e.status !== HttpStatus.INTERNAL_SERVER_ERROR){
                throw new HttpException(e.response, e.status);
            }
            throw new HttpException('Ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
