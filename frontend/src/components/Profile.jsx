import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux'; 
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    
    const [recommendedJobs, setRecommendedJobs] = useState([]);

    // Fetch job recommendations
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user?._id) return;

            try {
                const response = await fetch(`http://localhost:8000/api/v1/ai/recommendations/${user._id}`);
                console.log("Fetching recommendations from:", `http://localhost:8000/api/v1/ai/recommendations/${user._id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch recommendations");
                }

                const data = await response.json();
                console.log("Job Recommendations:", data);

                setRecommendedJobs(data.jobs || []);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [user]);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
                        <Pen />
                    </Button>
                </div>
                
                {/* Contact Info */}
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>

                {/* Skills */}
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {user?.profile?.skills.length !== 0 ? (
                            user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>)
                        ) : (
                            <span>NA</span>
                        )}
                    </div>
                </div>

                {/* Resume */}
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {isResume ? (
                        <a target='_blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>
                            {user?.profile?.resumeOriginalName}
                        </a>
                    ) : (
                        <span>NA</span>
                    )}
                </div>
            </div>

            {/* Job Recommendations Section */}
            <div className='max-w-4xl mx-auto bg-white rounded-2xl my-5 p-8 shadow-lg'>
                <h1 className='font-bold text-xl mb-6 text-gray-800'>Recommended Jobs</h1>
                {recommendedJobs.length > 0 ? (
                    <div className="grid gap-4">
                        {recommendedJobs.map((job, index) => (
                            <div key={index} className="p-4 border rounded-lg shadow-sm transition-transform hover:scale-105 hover:shadow-md bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                                    <p className="text-gray-600 text-sm mt-1">
    <span className="font-semibold text-gray-900">Company:</span> 
    <span className="ml-1 text-purple-700 font-bold">{job.companyName || "Unknown"}</span>
</p>

<p className="text-gray-600 text-sm">
    <span className="font-semibold text-gray-900">Fit Score:</span> 
    <span className="ml-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg font-bold">
        {job.fitScore}%
    </span>
</p>

                                </div>
                                <Button 
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                                    onClick={() => navigate(`/description/${job._id}`)}
                                >
                                    View Job
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No recommendations available</p>
                )}
            </div>

            {/* Applied Jobs Section */}
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
