import { Users } from '../entities/user.entity';
import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
    IsNotEmpty,
} from 'class-validator';

// Função para validar CPF
export const isCpfValid = async (cpf: string): Promise<boolean> => {
    if (!cpf || cpf.trim() === '') return false;
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf == '') return false;

    if (
        cpf.length != 11 ||
        cpf == '00000000000' ||
        cpf == '11111111111' ||
        cpf == '22222222222' ||
        cpf == '33333333333' ||
        cpf == '44444444444' ||
        cpf == '55555555555' ||
        cpf == '66666666666' ||
        cpf == '77777777777' ||
        cpf == '88888888888' ||
        cpf == '99999999999'
    )
        return false;

    let add: number = 0;

    for (let index: number = 0; index < 9; index++) {
        add += parseInt(cpf.charAt(index)) * (10 - index);
    }

    let rev: number = 11 - (add % 11);

    if (rev == 10 || rev == 11) {
        rev = 0;
    }

    if (rev != parseInt(cpf.charAt(9))) {
        return false;
    }

    add = 0;

    for (let index: number = 0; index < 10; index++) {
        add += parseInt(cpf.charAt(index)) * (11 - index);
    }

    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
        rev = 0;
    }

    if (rev != parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
};

// Classe de validação customizada para validar CPF
@ValidatorConstraint({ name: 'isValidCpf', async: true })
export class IsValidCpf implements ValidatorConstraintInterface {
    async validate(cpf: string, args: ValidationArguments) {
        return await isCpfValid(cpf);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Invalid CPF';
    }
}

// Decorator para validar CPF
export function IsCPF(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidCpf,
        });
    };
}

export class CreateUserDto extends Users {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password: string;

    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'CPF is required' })
    @IsCPF({ message: 'Invalid CPF' }) // Usando a validação customizada para CPF
    cpf: string;
}
