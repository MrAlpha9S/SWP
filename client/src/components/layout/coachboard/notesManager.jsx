import React, {useEffect, useState} from 'react';
import { Button, Input, Space, Typography, message, Divider } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import {
    getUserNotes,
    createUserNote,
    updateUserNote,
    deleteUserNote
} from '../../utils/userUtils.js';
import UserNoteCard from '../../ui/userNoteCard.jsx';

const { TextArea } = Input;
const { Title } = Typography;

const NotesManager = ({ userAuth0Id }) => {
    const queryClient = useQueryClient();
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [newContent, setNewContent] = useState('');

    const { data: notes = [], isPending } = useQuery({
        queryKey: ['user-notes', userAuth0Id],
        queryFn: () =>
            getUserNotes(user, getAccessTokenSilently, isAuthenticated, userAuth0Id),
        enabled: !!user && !!isAuthenticated
    });

    const createMutation = useMutation({
        mutationFn: ({ content }) =>
            createUserNote(user, getAccessTokenSilently, isAuthenticated, userAuth0Id, user.sub, content),
        onSuccess: () => {
            queryClient.invalidateQueries(['user-notes', userAuth0Id]);
            setNewContent('');
            message.success('Note created');
        },
        onError: () => {
            message.error('Failed to create note');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ content, noteOfAuth0Id, noteId }) =>
            updateUserNote(user, getAccessTokenSilently, isAuthenticated, noteId, noteOfAuth0Id, user.sub, content),
        onSuccess: () => {
            queryClient.invalidateQueries(['user-notes', userAuth0Id]);
            message.success('Note updated');
        },
        onError: () => {
            message.error('Failed to update note');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (noteId) =>
            deleteUserNote(user, getAccessTokenSilently, isAuthenticated, noteId),
        onSuccess: () => {
            queryClient.invalidateQueries(['user-notes', userAuth0Id]);
            message.success('Note deleted');
        },
        onError: () => {
            message.error('Failed to delete note');
        }
    });

    const handleCreate = () => {
        if (!newContent.trim()) {
            message.warning('Note content cannot be empty.');
            return;
        }
        createMutation.mutate({ content: newContent.trim() });
    };

    useEffect(() => {
        if (!isPending) {
            console.log(notes)
        }
    }, [isPending])

    return (
        <div className='w-full'>
            <Title level={4}>Ghi chú</Title>
            <TextArea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Nhập nội dung ghi chú..."
                rows={3}
            />
            <Button
                type="primary"
                onClick={handleCreate}
                disabled={createMutation.isPending}
                style={{ marginTop: '0.5rem' }}
            >
                Thêm ghi chú
            </Button>

            <Divider />

            {!isPending && notes &&
                notes?.data?.map((note) => (
                    <UserNoteCard
                        key={note.note_id}
                        note={note}
                        onEdit={(updatedNote) => {
                            if (!updatedNote.content.trim()) {
                                return message.warning('Updated content cannot be empty.');
                            }
                            updateMutation.mutate({
                                content: updatedNote.content.trim(),
                                noteOfAuth0Id: userAuth0Id,
                                noteId: updatedNote.note_id
                            });
                        }}
                        onDelete={(noteId) => deleteMutation.mutate(noteId)}
                    />
                ))}
        </div>
    );
};

export default NotesManager;
