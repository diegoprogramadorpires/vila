import { Users } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';


@Entity({ name: 'user_profile' })
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'bio', nullable: false })
    bio: string;

    @Column({ name: 'profile_picture', nullable: false })
    profilePicture: string;

    @Column({ name: 'contact_info', nullable: false, type: 'json' })
    contactInfo: { phoneNumber: string; secondaryEmail?: string };

    @OneToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user: Users;
}
