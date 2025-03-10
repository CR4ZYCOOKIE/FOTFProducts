import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';

interface Subscription {
  id: string;
  product_name: string;
  discord_username: string;
  start_date: string;
  next_billing_date: string;
  status: 'active' | 'canceled';
}

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      // Call your backend API to cancel the subscription
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');

      toast.success('Subscription canceled successfully');
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Your Subscriptions
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Manage your active subscriptions and billing
          </p>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-xl font-medium text-white">No Active Subscriptions</h3>
            <p className="mt-2 text-gray-400">You don't have any active subscriptions yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {subscription.product_name}
                      </h3>
                      <p className="text-gray-400 mt-1">
                        Discord: {subscription.discord_username}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Start Date</p>
                      <p className="text-white">
                        {format(new Date(subscription.start_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Next Billing Date</p>
                      <p className="text-white">
                        {format(new Date(subscription.next_billing_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  {subscription.status === 'active' && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleCancelSubscription(subscription.id)}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;