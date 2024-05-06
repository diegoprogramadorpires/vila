import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'revoked_tokens' })
export class RevokedToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'token', nullable: false })
    token: string;

    @Column({ nullable: true })
    userId: string;

    @Column()
    exp: Date;
}

