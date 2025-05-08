package com.safetrack;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.messages.Message;
import com.google.android.gms.nearby.messages.MessageListener;

public class NearbyService extends Service {

    private static final String TAG = "NearbyService";
    private MessageListener mMessageListener;
    private Message mMessage;
    private com.google.android.gms.nearby.messages.MessagesClient mMessagesClient; // Corrected

    @Override
    public void onCreate() {
        super.onCreate();

        // Set up the message listener
        mMessageListener = new MessageListener() {
            @Override
            public void onFound(Message message) {
                // Handle the message found event here (e.g. show a Toast or update UI)
                Log.d(TAG, "Message found: " + new String(message.getContent())); // Corrected
            }

            @Override
            public void onLost(Message message) {
                // Handle the message lost event here (e.g. stop updates or clear UI)
                Log.d(TAG, "Message lost: " + new String(message.getContent()));  // Corrected
            }
        };

        // Set up the Nearby message
        mMessage = new Message("Hello from Nearby".getBytes());
        mMessagesClient = Nearby.getMessagesClient(this); // Initialize here
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Start broadcasting the message
        mMessagesClient.publish(mMessage);
        // Start listening for nearby messages
        mMessagesClient.subscribe(mMessageListener);
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        // Stop broadcasting the message and listening
        if (mMessagesClient != null) { // Check if it's initialized
            mMessagesClient.unsubscribe(mMessageListener);
            mMessagesClient.unpublish(mMessage);
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
